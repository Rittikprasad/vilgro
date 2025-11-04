import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AssessmentLayout from "./AssessmentLayout";
import QuestionRenderer from "./QuestionRenderer";
import AssessmentDashboard from "./AssessmentDashboard";
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
  progress?: {
    answered: number;
    required: number;
  };
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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const initializationRef = useRef(false);

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
                                setCurrentQuestionIndex(0);
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
                                    setCurrentQuestionIndex(0);
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
        isCompleted: section.progress.required > 0 && section.progress.answered === section.progress.required,
        progress: section.progress
    })) || [];

    // Calculate total progress
    const progressPercent = sections?.progress.percent || 0;

    // Check if we're on the first section and first question
    const isFirstSection = sections?.sections.findIndex(s => s.code === currentSection) === 0;
    const isFirstQuestion = currentQuestionIndex === 0;
    
    // Check if we're on the last section and last question
    const isLastSection = sections?.sections.findIndex(s => s.code === currentSection) === (sections?.sections.length || 0) - 1;
    const isLastQuestion = currentQuestionIndex === (questions?.length || 0) - 1;

    // Handle step navigation
    const handleStepClick = useCallback(async (stepId: string) => {
        if (!currentAssessment || currentAssessment.status !== 'DRAFT' || !questions) return;

        const sectionCode = stepId.toUpperCase();
        
        // Save current question's answer before switching sections (if answered)
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = localAnswers[currentQuestion.code];
        
        if (currentAnswer) {
            const answer = {
                question: currentQuestion.code,
                data: currentAnswer
            };
            
            // Save the answer and update progress
            await dispatch(saveAnswers({ assessmentId: currentAssessment.id, answers: [answer] }) as any);
            
            // Refresh sections to get updated progress
            await dispatch(getSections(currentAssessment.id) as any);
        }

        // Switch to new section
        dispatch(setCurrentSection(sectionCode));
        setCurrentQuestionIndex(0); // Reset to first question
        await dispatch(getQuestions({ assessmentId: currentAssessment.id, section: sectionCode }) as any);
    }, [currentAssessment, currentQuestionIndex, questions, localAnswers, dispatch]);

    // Handle answer changes - only update local state, save happens when navigating
    const handleAnswerChange = useCallback((questionCode: string, value: any) => {
        if (!currentAssessment) return;

        // Update local state only
        dispatch(updateLocalAnswer({ questionCode, value }));
    }, [currentAssessment, dispatch]);

    // Handle navigation
    const handleBack = useCallback(async () => {
        if (!currentAssessment || !sections || !questions) return;

        // Save current question's answer before going back (if answered)
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = localAnswers[currentQuestion.code];
        
        if (currentAnswer) {
            const answer = {
                question: currentQuestion.code,
                data: currentAnswer
            };
            
            // Save the answer and update progress
            await dispatch(saveAnswers({ assessmentId: currentAssessment.id, answers: [answer] }) as any);
            
            // Refresh sections to get updated progress
            await dispatch(getSections(currentAssessment.id) as any);
        }

        // If not on first question, go to previous question in current section
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            return;
        }

        // We're on first question of current section
        // Find current section index
        const currentIndex = sections.sections.findIndex(s => s.code === currentSection);
        
        // If not first section, go to previous section
        if (currentIndex > 0) {
            const prevSection = sections.sections[currentIndex - 1];
            dispatch(setCurrentSection(prevSection.code));
            const result = await dispatch(getQuestions({ assessmentId: currentAssessment.id, section: prevSection.code }) as any);
            
            // Set to last question of previous section
            if (getQuestions.fulfilled.match(result) && result.payload.questions) {
                setCurrentQuestionIndex(result.payload.questions.length - 1);
            }
        }
    }, [currentAssessment, sections, currentSection, currentQuestionIndex, questions, localAnswers, dispatch]);

    const handleNext = useCallback(async () => {
        if (!currentAssessment || !sections || !questions) return;

        // Save current question's answer before proceeding
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = localAnswers[currentQuestion.code];
        
        if (currentAnswer) {
            const answer = {
                question: currentQuestion.code,
                data: currentAnswer
            };
            
            // Save the answer and update progress
            await dispatch(saveAnswers({ assessmentId: currentAssessment.id, answers: [answer] }) as any);
            
            // Refresh sections to get updated progress
            await dispatch(getSections(currentAssessment.id) as any);
        }

        // If not on last question of current section, go to next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            return;
        }

        // We're on the last question of current section
        // Find current section index
        const currentIndex = sections.sections.findIndex(s => s.code === currentSection);
        
        if (currentIndex < sections.sections.length - 1) {
            // Move to next section
            const nextSection = sections.sections[currentIndex + 1];
            dispatch(setCurrentSection(nextSection.code));
            setCurrentQuestionIndex(0); // Reset to first question
            await dispatch(getQuestions({ assessmentId: currentAssessment.id, section: nextSection.code }) as any);
        } else {
            // Last section - submit assessment
            try {
                const result = await dispatch(submitAssessment(currentAssessment.id) as any);
                
                if (submitAssessment.fulfilled.match(result)) {
                    // Success - redirect to success page with assessmentId
                    navigate(`/assessment/${currentAssessment.id}/success`);
                } else if (submitAssessment.rejected.match(result)) {
                    // Handle missing answers error
                    console.error('Submission failed:', result.payload);
                }
            } catch (error) {
                console.error('Failed to submit assessment:', error);
            }
        }
    }, [currentAssessment, sections, currentSection, currentQuestionIndex, questions, localAnswers, dispatch, navigate]);

    // Show dashboard when cooldown is active (user has already submitted assessment)
    if (cooldownMessage) {
        return (
            <>
                <Navbar />
                <AssessmentDashboard />
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
                progressPercent={progressPercent}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={!(isFirstSection && isFirstQuestion)}
                showNextButton={true}
                nextButtonText={isLastSection && isLastQuestion ? "Get Result" : "Next"}
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
                progressPercent={progressPercent}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={!(isFirstSection && isFirstQuestion)}
                showNextButton={true}
                nextButtonText={isLastSection && isLastQuestion ? "Get Result" : "Next"}
                nextButtonDisabled={isSubmitting}
            >
                {/* Current Question Only */}
                {questions && questions[currentQuestionIndex] && (
                    <QuestionRenderer
                        key={questions[currentQuestionIndex].code}
                        question={questions[currentQuestionIndex]}
                        questionNumber={currentQuestionIndex + 1}
                        value={localAnswers[questions[currentQuestionIndex].code] || questions[currentQuestionIndex].answer}
                        onChange={(value) => handleAnswerChange(questions[currentQuestionIndex].code, value)}
                        disabled={isSubmitting}
                    />
                )}

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
