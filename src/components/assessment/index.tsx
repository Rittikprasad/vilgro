import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AssessmentLayout from "./AssessmentLayout";
import QuestionRenderer from "./QuestionRenderer";
import AssessmentExitModal from "./AssessmentExitModal";
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

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
    const initializationRef = useRef(false);
    const location = useLocation();

    // Handle browser back button and page unload
    useEffect(() => {
        if (!currentAssessment || currentAssessment.status !== 'DRAFT') {
            return;
        }

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        // Handle browser back button
        const handlePopState = () => {
            setShowExitModal(true);
            setPendingNavigation(() => () => {
                window.history.back();
            });
            // Push current state back to prevent navigation
            window.history.pushState(null, '', location.pathname);
        };

        // Push a state to detect back button
        window.history.pushState(null, '', location.pathname);

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [currentAssessment, location.pathname]);

    // Expose exit handler to window for Navbar to use
    useEffect(() => {
        if (currentAssessment && currentAssessment.status === 'DRAFT') {
            (window as any).__assessmentExitHandler = (onConfirm: () => void) => {
                setShowExitModal(true);
                setPendingNavigation(() => onConfirm);
            };
        } else {
            delete (window as any).__assessmentExitHandler;
        }

        return () => {
            delete (window as any).__assessmentExitHandler;
        };
    }, [currentAssessment]);

    // Initialize assessment on mount - load sections/questions if needed
    useEffect(() => {
        // Prevent multiple initializations if already initialized
        if (initializationRef.current) {
            return;
        }
        
        // If we have a current assessment but no sections loaded, we need to load them
        const needsInitialization = !currentAssessment || !sections || (currentAssessment.status === 'DRAFT' && !currentSection);

        if (!needsInitialization && (currentAssessment || isLoading)) {
            return;
        }
        
        initializationRef.current = true;

        const initializeAssessment = async () => {
            try {
                console.log('Initializing assessment...');
                
                // If we already have a current assessment, use it; otherwise fetch it
                let assessment = currentAssessment;
                
                if (!assessment) {
                    // Try to get current assessment first
                    const currentResult = await dispatch(getCurrentAssessment() as any);
                    console.log('getCurrentAssessment result:', currentResult);
                    
                    if (getCurrentAssessment.fulfilled.match(currentResult) && currentResult.payload) {
                        assessment = currentResult.payload;
                    }
                }
                
                if (assessment) {
                    console.log('Using assessment:', assessment);
                    
                    if (assessment.status === 'DRAFT') {
                        // Load sections if not already loaded
                        if (!sections) {
                            console.log('Loading sections for assessment:', assessment.id);
                            const assessmentIdStr = String(assessment.id);
                            const sectionsResult = await dispatch(getSections(assessmentIdStr) as any);
                            console.log('getSections result:', sectionsResult);
                            
                            if (getSections.fulfilled.match(sectionsResult)) {
                                // Load first section questions if no current section
                                if (sectionsResult.payload.sections.length && !currentSection) {
                                    const firstSection = sectionsResult.payload.sections[0].code;
                                    console.log('Loading questions for section:', firstSection);
                                    dispatch(setCurrentSection(firstSection));
                                    setCurrentQuestionIndex(0);
                                    await dispatch(getQuestions({ assessmentId: assessmentIdStr, section: firstSection }) as any);
                                }
                            }
                        } else if (sections && !currentSection) {
                            // Sections loaded but no current section selected - load first section questions
                            const assessmentIdStr = String(assessment.id);
                            const firstSection = sections.sections[0]?.code;
                            if (firstSection) {
                                console.log('Loading questions for first section:', firstSection);
                                dispatch(setCurrentSection(firstSection));
                                setCurrentQuestionIndex(0);
                                await dispatch(getQuestions({ assessmentId: assessmentIdStr, section: firstSection }) as any);
                            }
                        }
                    } else if (assessment.status === 'SUBMITTED') {
                        // Redirect to dashboard for submitted assessments
                        navigate('/assessment/dashboard', { replace: true });
                        return;
                    }
                } else {
                    // No current assessment, start a new one
                    console.log('No current assessment found, starting new one...');
                    const startResult = await dispatch(startAssessment() as any);
                    console.log('startAssessment result:', startResult);
                    
                    if (startAssessment.fulfilled.match(startResult)) {
                        const newAssessment = startResult.payload;
                        console.log('Started new assessment:', newAssessment);
                        
                        if (newAssessment.status === 'DRAFT') {
                            // Load sections for new draft
                            console.log('Loading sections for new assessment:', newAssessment.id);
                            const assessmentIdStr = String(newAssessment.id);
                            const sectionsResult = await dispatch(getSections(assessmentIdStr) as any);
                            console.log('getSections result:', sectionsResult);
                            
                            if (getSections.fulfilled.match(sectionsResult)) {
                                // Load first section questions
                                if (sectionsResult.payload.sections.length) {
                                    const firstSection = sectionsResult.payload.sections[0].code;
                                    console.log('Loading questions for first section:', firstSection);
                                    dispatch(setCurrentSection(firstSection));
                                    setCurrentQuestionIndex(0);
                                    await dispatch(getQuestions({ assessmentId: assessmentIdStr, section: firstSection }) as any);
                                }
                            }
                        }
                    } else if (startAssessment.rejected.match(startResult)) {
                        console.log('startAssessment rejected:', startResult.payload);
                        if (startResult.payload === 'COOLDOWN_ACTIVE') {
                            // Redirect to dashboard when cooldown is active
                            navigate('/assessment/dashboard', { replace: true });
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to initialize assessment:', error);
            } finally {
                // Reset initialization flag after a delay to allow re-initialization if needed
                setTimeout(() => {
                    initializationRef.current = false;
                }, 1000);
            }
        };

        initializeAssessment();
    }, [dispatch, navigate, currentAssessment, isLoading, currentSection, sections]);

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
    const sectionList = sections?.sections || [];
    const actionableSections = sectionList.filter(section => (section.progress?.required ?? 0) > 0);
    const currentActionableIndex = actionableSections.findIndex(section => section.code === currentSection);
    const isFirstQuestion = currentQuestionIndex === 0;
    const isFirstActionableSection = currentActionableIndex === 0;
    
    // Check if we're on the last section and last question
    const isLastQuestion = currentQuestionIndex === (questions?.length || 0) - 1;
    const isLastActionableSection = currentActionableIndex === actionableSections.length - 1 && actionableSections.length > 0;

    // Handle step navigation
    const isAnswerProvided = useCallback((question: any, answer: any) => {
        if (!question) return false;
        if (!question.required) return true;
        if (!answer) return false;

        switch (question.type) {
            case 'SINGLE_CHOICE':
            case 'NPS':
                return answer.value !== undefined && answer.value !== null && answer.value !== '';
            case 'MULTI_CHOICE':
                return Array.isArray(answer.values) && answer.values.length > 0;
            case 'SLIDER':
            case 'RATING':
                return answer.value !== undefined && answer.value !== null;
            case 'MULTI_SLIDER':
                if (!question.dimensions || question.dimensions.length === 0 || !answer.values) {
                    return false;
                }
                return question.dimensions.every((dimension: any) => answer.values[dimension.code] !== undefined && answer.values[dimension.code] !== null);
            default:
                return answer.value !== undefined && answer.value !== null;
        }
    }, []);

    const getAnswerForQuestion = useCallback((question: any) => {
        if (!question) return undefined;
        const localAnswer = localAnswers[question.code];
        return localAnswer !== undefined ? localAnswer : question.answer;
    }, [localAnswers]);

    const handleStepClick = useCallback(async (stepId: string) => {
        if (!currentAssessment || currentAssessment.status !== 'DRAFT' || !questions) return;

        const sectionCode = stepId.toUpperCase();
        const isSectionActionable = actionableSections.some(section => section.code === sectionCode);
        if (!isSectionActionable) {
            return;
        }
        
        // Save current question's answer before switching sections (if answered)
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = getAnswerForQuestion(currentQuestion);

        if (!isAnswerProvided(currentQuestion, currentAnswer)) {
            setValidationError("Please answer this question before moving ahead.");
            return;
        }
        
        const localAnswer = localAnswers[currentQuestion.code];
        if (localAnswer) {
            const answer = {
                question: currentQuestion.code,
                data: localAnswer
            };
            
            // Save the answer and update progress
            const assessmentIdStr = String(currentAssessment.id);
            await dispatch(saveAnswers({ assessmentId: assessmentIdStr, answers: [answer] }) as any);
            
            // Refresh sections to get updated progress
            await dispatch(getSections(assessmentIdStr) as any);
        }

        // Switch to new section
        dispatch(setCurrentSection(sectionCode));
        setCurrentQuestionIndex(0); // Reset to first question
        const assessmentIdStr = String(currentAssessment.id);
        await dispatch(getQuestions({ assessmentId: assessmentIdStr, section: sectionCode }) as any);
    }, [currentAssessment, currentQuestionIndex, questions, localAnswers, dispatch, isAnswerProvided, getAnswerForQuestion, actionableSections]);

    // Handle answer changes - only update local state, save happens when navigating
    const handleAnswerChange = useCallback((questionCode: string, value: any) => {
        if (!currentAssessment) return;

        // Update local state only
        dispatch(updateLocalAnswer({ questionCode, value }));
        setValidationError(null);
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
            const assessmentIdStr = String(currentAssessment.id);
            await dispatch(saveAnswers({ assessmentId: assessmentIdStr, answers: [answer] }) as any);
            
            // Refresh sections to get updated progress
            await dispatch(getSections(assessmentIdStr) as any);
        }

        // If not on first question, go to previous question in current section
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            return;
        }

        // We're on first question of current section - move to previous actionable section if available.
        const currentIndex = actionableSections.findIndex(s => s.code === currentSection);
        
        if (currentIndex > 0) {
            const prevSection = actionableSections[currentIndex - 1];
            dispatch(setCurrentSection(prevSection.code));
            const assessmentIdStr = String(currentAssessment.id);
            const result = await dispatch(getQuestions({ assessmentId: assessmentIdStr, section: prevSection.code }) as any);
            
            // Set to last question of previous section
            if (getQuestions.fulfilled.match(result) && result.payload.questions) {
                setCurrentQuestionIndex(result.payload.questions.length - 1);
            }
        }
    }, [currentAssessment, sections, currentSection, currentQuestionIndex, questions, localAnswers, dispatch, actionableSections]);

    const handleNext = useCallback(async () => {
        if (!currentAssessment || !sections || !questions) return;

        // Save current question's answer before proceeding
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const currentAnswer = getAnswerForQuestion(currentQuestion);

        if (!isAnswerProvided(currentQuestion, currentAnswer)) {
            setValidationError("Please answer this question before moving ahead.");
            return;
        }

        setValidationError(null);
        
        const localAnswer = localAnswers[currentQuestion.code];
        if (localAnswer) {
            const answer = {
                question: currentQuestion.code,
                data: localAnswer
            };
            
            // Save the answer and update progress
            const assessmentIdStr = String(currentAssessment.id);
            await dispatch(saveAnswers({ assessmentId: assessmentIdStr, answers: [answer] }) as any);
            
            // Refresh sections to get updated progress
            await dispatch(getSections(assessmentIdStr) as any);
        }

        // If not on last question of current section, go to next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            return;
        }

        // We're on the last question of current section - move to next actionable section, otherwise submit.
        const currentIndex = actionableSections.findIndex(s => s.code === currentSection);
        const assessmentIdStr = String(currentAssessment.id);
        
        if (currentIndex > -1 && currentIndex < actionableSections.length - 1) {
            const nextSection = actionableSections[currentIndex + 1];
            dispatch(setCurrentSection(nextSection.code));
            setCurrentQuestionIndex(0); // Reset to first question
            await dispatch(getQuestions({ assessmentId: assessmentIdStr, section: nextSection.code }) as any);
        } else {
            // Last section - submit assessment
            try {
                const result = await dispatch(submitAssessment(assessmentIdStr) as any);
                
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
    }, [currentAssessment, sections, currentSection, currentQuestionIndex, questions, localAnswers, dispatch, navigate, isAnswerProvided, getAnswerForQuestion, actionableSections]);

    // Handle exit modal actions - MUST be before any early returns
    const handleExitSubmit = useCallback(() => {
        setShowExitModal(false);
        if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
        }
    }, [pendingNavigation]);

    const handleExitSkip = useCallback(() => {
        setShowExitModal(false);
        if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
        }
    }, [pendingNavigation]);

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
                showBackButton={!(isFirstActionableSection && isFirstQuestion)}
                showNextButton={true}
                nextButtonText={isLastActionableSection && isLastQuestion ? "Get Result" : "Next"}
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

    const currentQuestion = questions ? questions[currentQuestionIndex] : null;
    const currentAnswer = getAnswerForQuestion(currentQuestion);
    const isCurrentQuestionAnswered = isAnswerProvided(currentQuestion, currentAnswer);

    return (
        <>
            <Navbar />
            <AssessmentExitModal
                isOpen={showExitModal}
                assessmentId={currentAssessment?.id || ''}
                onSubmit={handleExitSubmit}
                onSkip={handleExitSkip}
            />
            <AssessmentLayout
                steps={steps}
                currentStep={currentSection?.toLowerCase() || ""}
                onStepClick={handleStepClick}
                progressPercent={progressPercent}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={!(isFirstActionableSection && isFirstQuestion)}
                showNextButton={true}
                nextButtonText={isLastActionableSection && isLastQuestion ? "Get Result" : "Next"}
                nextButtonDisabled={isSubmitting || !isCurrentQuestionAnswered}
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

                {validationError && (
                    <div className="mt-4 text-sm text-red-600">
                        {validationError}
                    </div>
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
