import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AssessmentLayout from "./AssessmentLayout";
import QuestionRenderer from "./QuestionRenderer";
import Navbar from "../ui/Navbar";
import { 
  startAssessment, 
  getCurrentAssessment, 
  getSections, 
  getQuestions, 
  setCurrentSection,
  updateLocalAnswer,
  saveAnswers,
  submitAssessment,
  clearError
} from "../../features/assessment/assessmentSlice";
import type { RootState } from "../../app/store";

interface AssessmentStep {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

const Assessment: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const {
        currentAssessment,
        sections,
        currentSection,
        questions,
        questionsLoading,
        localAnswers,
        isSubmitting,
        submitError,
        isLoading,
        error
    } = useSelector((state: RootState) => state.assessment);

    const [cooldownMessage, setCooldownMessage] = useState<string>("");
    const initializationRef = useRef(false);

    // Helper to collect all answers for the current section
    const collectCurrentSectionAnswers = useCallback(() => {
        if (!questions || questions.length === 0) return [];
        
        return questions
            .map(question => {
                // Use localAnswer if exists, otherwise use saved answer
                const value = localAnswers[question.code] || question.answer;
                
                // Only include if answer exists
                if (!value) return null;
                
                return {
                    question: question.code,
                    data: value
                };
            })
            .filter(Boolean) as Array<{ question: string; data: any }>;
    }, [questions, localAnswers]);

    // Initialize assessment on mount - only run once
    useEffect(() => {
        // Prevent multiple initializations
        if (initializationRef.current || currentAssessment || isLoading) {
            return;
        }
        
        initializationRef.current = true;

        const initializeAssessment = async () => {
            try {
                console.log('Initializing assessment...');
                
                // Try to get current assessment first
                const currentResult = await dispatch(getCurrentAssessment() as any);
                console.log('getCurrentAssessment result:', currentResult);
                
                if (getCurrentAssessment.fulfilled.match(currentResult) && currentResult.payload) {
                    // We have an existing assessment
                    const assessment = currentResult.payload;
                    console.log('Found existing assessment:', assessment);
                    
                    if (assessment.status === 'DRAFT') {
                        // Load sections for existing draft
                        console.log('Loading sections for assessment:', assessment.id);
                        const sectionsResult = await dispatch(getSections(assessment.id) as any);
                        console.log('getSections result:', sectionsResult);
                        
                        if (getSections.fulfilled.match(sectionsResult)) {
                            // Load first section questions if no current section
                            if (sectionsResult.payload.sections.length && !currentSection) {
                                const firstSection = sectionsResult.payload.sections[0].code;
                                console.log('Loading questions for section:', firstSection);
                                dispatch(setCurrentSection(firstSection));
                                await dispatch(getQuestions({ assessmentId: assessment.id, section: firstSection }) as any);
                            }
                        }
                    } else if (assessment.status === 'SUBMITTED') {
                        // Redirect to results
                        navigate('/assessment/results');
                        return;
                    }
                } else {
                    // No current assessment, start a new one
                    console.log('No current assessment found, starting new one...');
                    const startResult = await dispatch(startAssessment() as any);
                    console.log('startAssessment result:', startResult);
                    
                    if (startAssessment.fulfilled.match(startResult)) {
                        const assessment = startResult.payload;
                        console.log('Started new assessment:', assessment);
                        
                        if (assessment.status === 'DRAFT') {
                            // Load sections for new draft
                            console.log('Loading sections for new assessment:', assessment.id);
                            const sectionsResult = await dispatch(getSections(assessment.id) as any);
                            console.log('getSections result:', sectionsResult);
                            
                            if (getSections.fulfilled.match(sectionsResult)) {
                                // Load first section questions
                                if (sectionsResult.payload.sections.length) {
                                    const firstSection = sectionsResult.payload.sections[0].code;
                                    console.log('Loading questions for first section:', firstSection);
                                    dispatch(setCurrentSection(firstSection));
                                    await dispatch(getQuestions({ assessmentId: assessment.id, section: firstSection }) as any);
                                }
                            }
                        }
                    } else if (startAssessment.rejected.match(startResult)) {
                        console.log('startAssessment rejected:', startResult.payload);
                        if (startResult.payload === 'COOLDOWN_ACTIVE') {
                            setCooldownMessage('Assessment cooldown is active. Please wait before starting a new assessment.');
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to initialize assessment:', error);
            }
        };

        initializeAssessment();
    }, [dispatch, navigate, currentAssessment, isLoading, currentSection]);

    // Convert sections to steps for sidebar
    const steps: AssessmentStep[] = sections?.sections.map(section => ({
        id: section.code.toLowerCase(),
        label: section.title,
        isActive: section.code === currentSection,
        isCompleted: section.progress.answered === section.progress.required
    })) || [];

    // Calculate total progress
    const totalAnswered = sections?.progress.answered || 0;
    const totalRequired = sections?.progress.required || 0;

    // Check if we're on the first section
    const isFirstSection = sections?.sections.findIndex(s => s.code === currentSection) === 0;

    // Handle step navigation
    const handleStepClick = useCallback(async (stepId: string) => {
        if (!currentAssessment || currentAssessment.status !== 'DRAFT') return;

        const sectionCode = stepId.toUpperCase();
        
        // Save all answers from current section before switching
        const answers = collectCurrentSectionAnswers();
        if (answers.length > 0) {
            await dispatch(saveAnswers({ assessmentId: currentAssessment.id, answers }) as any);
        }

        // Switch to new section
        dispatch(setCurrentSection(sectionCode));
        await dispatch(getQuestions({ assessmentId: currentAssessment.id, section: sectionCode }) as any);
    }, [currentAssessment, dispatch, collectCurrentSectionAnswers]);

    // Handle answer changes - only update local state, save happens when navigating
    const handleAnswerChange = useCallback((questionCode: string, value: any) => {
        if (!currentAssessment) return;

        // Update local state only
        dispatch(updateLocalAnswer({ questionCode, value }));
    }, [currentAssessment, dispatch]);

    // Handle navigation
    const handleBack = useCallback(async () => {
        if (!currentAssessment || !sections) return;

        // Save all answers from current section before going back
        const answers = collectCurrentSectionAnswers();
        if (answers.length > 0) {
            await dispatch(saveAnswers({ assessmentId: currentAssessment.id, answers }) as any);
        }

        // Find current section index
        const currentIndex = sections.sections.findIndex(s => s.code === currentSection);
        
        // If not first section, go to previous section
        if (currentIndex > 0) {
            const prevSection = sections.sections[currentIndex - 1];
            dispatch(setCurrentSection(prevSection.code));
            await dispatch(getQuestions({ assessmentId: currentAssessment.id, section: prevSection.code }) as any);
        }
    }, [currentAssessment, sections, currentSection, dispatch, collectCurrentSectionAnswers]);

    const handleNext = useCallback(async () => {
        if (!currentAssessment || !sections) return;

        // Save all answers from current section
        const answers = collectCurrentSectionAnswers();
        if (answers.length > 0) {
            await dispatch(saveAnswers({ assessmentId: currentAssessment.id, answers }) as any);
        }

        // Find current section index
        const currentIndex = sections.sections.findIndex(s => s.code === currentSection);
        
        if (currentIndex < sections.sections.length - 1) {
            // Move to next section
            const nextSection = sections.sections[currentIndex + 1];
            dispatch(setCurrentSection(nextSection.code));
            await dispatch(getQuestions({ assessmentId: currentAssessment.id, section: nextSection.code }) as any);
        } else {
            // Last section - submit assessment
            try {
                const result = await dispatch(submitAssessment(currentAssessment.id) as any);
                
                if (submitAssessment.fulfilled.match(result)) {
                    // Success - redirect to results
                    navigate('/assessment/results');
                } else if (submitAssessment.rejected.match(result)) {
                    // Handle missing answers error
                    console.error('Submission failed:', result.payload);
                }
            } catch (error) {
                console.error('Failed to submit assessment:', error);
            }
        }
    }, [currentAssessment, sections, currentSection, dispatch, collectCurrentSectionAnswers, navigate]);

    // Show cooldown screen
    if (cooldownMessage) {
        return (
            <>
                <Navbar />
                <div className="pt-20 p-6">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-yellow-600 text-6xl mb-4">⏰</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assessment Cooldown</h2>
                        <p className="text-gray-600 mb-6">{cooldownMessage}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Show loading state
    if (isLoading && !currentAssessment) {
        return (
            <>
                <Navbar />
                <div className="pt-20 p-6">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading assessment...</p>
                    </div>
                </div>
            </>
        );
    }

    // Show error state
    if (error && !currentAssessment) {
        return (
            <>
                <Navbar />
                <div className="pt-20 p-6">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-yellow-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assessment API Not Available</h2>
                        <p className="text-gray-600 mb-6">
                            The assessment API endpoints are not available yet. This is expected during development.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Error: {error}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => dispatch(clearError())}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Show questions loading
    if (questionsLoading) {
        return (
            <>
                <Navbar />
            <AssessmentLayout
                steps={steps}
                currentStep={currentSection?.toLowerCase() || ""}
                onStepClick={handleStepClick}
                totalQuestions={totalRequired}
                answeredQuestions={totalAnswered}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={!isFirstSection}
                showNextButton={true}
                nextButtonText={currentSection === sections?.sections[sections.sections.length - 1]?.code ? "Submit" : "Next"}
                nextButtonDisabled={isSubmitting}
            >
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading questions...</p>
                </div>
            </AssessmentLayout>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <AssessmentLayout
                steps={steps}
                currentStep={currentSection?.toLowerCase() || ""}
                onStepClick={handleStepClick}
                totalQuestions={totalRequired}
                answeredQuestions={totalAnswered}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={!isFirstSection}
                showNextButton={true}
                nextButtonText={currentSection === sections?.sections[sections.sections.length - 1]?.code ? "Submit" : "Next"}
                nextButtonDisabled={isSubmitting}
            >
                {/* Questions */}
                {questions?.map((question) => (
                    <QuestionRenderer
                        key={question.code}
                        question={question}
                        value={localAnswers[question.code] || question.answer}
                        onChange={(value) => handleAnswerChange(question.code, value)}
                        disabled={isSubmitting}
                    />
                ))}

                {/* Submit Error */}
                {submitError && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{submitError}</p>
            </div>
                )}
            </AssessmentLayout>
        </>
    );
};

export default Assessment;
