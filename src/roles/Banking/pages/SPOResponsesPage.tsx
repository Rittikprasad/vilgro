import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BankingLayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import type { QuestionChoiceItem, QuestionItem } from "../../Admin/components/QuestionSection/QuestionListTable";
import SingleChoiceQuestion from "../../../components/ui/question/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../../components/ui/question/MultipleChoiceQuestion";
import SliderQuestion from "../../../components/ui/question/SliderQuestion";
import StarRatingQuestion from "../../../components/ui/question/StarRatingQuestion";
import VisualRatingQuestion from "../../../components/ui/question/VisualRatingQuestion";
import BackIcon from "../../../assets/svg/BackIcon.svg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchAssessmentResponses,
  clearAssessmentResponsesError,
  resetAssessmentResponses,
} from "../../../features/adminSpo/adminSpoSlice";
import { fetchBankSpoById } from "../../../features/bankingSpo/bankingSpoSlice";
import { Button } from "../../../components/ui/Button";

interface QuestionResponse extends QuestionItem {
  selectedValue?: string;
  selectedValues?: string[];
  sliderValue?: number;
  dimensionValues?: Record<string, number>;
  ratingValue?: number;
  npsValue?: number;
}

const slugifyLabel = (value: string): string => value.toLowerCase().replace(/\s+/g, "_");

const getChoiceMeta = (choice: string | QuestionChoiceItem) => {
  if (typeof choice === "string") {
    const slug = slugifyLabel(choice);
    return { label: choice, value: slug };
  }

  return {
    label: choice.label,
    value: choice.value || slugifyLabel(choice.label),
  };
};

const formatChoiceOptions = (choices?: Array<string | QuestionChoiceItem>) =>
  (choices || []).map((choice) => {
    const meta = getChoiceMeta(choice);
    return { label: meta.label, value: meta.value };
  });

const noop = () => {};

// Helper function to convert API question type to display type
const convertApiQuestionType = (apiType: string): string => {
  switch (apiType) {
    case 'SINGLE_CHOICE': return 'single-choice';
    case 'MULTI_SLIDER': return 'Multi-Slider';
    case 'MULTI_CHOICE': return 'Multi-select';
    case 'RATING': return 'RATING';
    case 'STAR_RATING': return 'RATING';
    case 'VISUAL_RATING': return 'Smiley face';
    case 'SLIDER': return 'Slider';
    case 'NPS': return 'NPS';
    default: return apiType;
  }
};

// Helper function to format answer value to readable text
const formatAnswerValue = (value: string): string => {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

// Helper function to convert API response to QuestionResponse format
const convertApiResponseToQuestionResponse = (
  apiQuestion: any,
  order: number
): QuestionResponse => {
  const displayType = convertApiQuestionType(apiQuestion.type);
  
  // Extract answer values based on question type
  let selectedValue: string | undefined;
  let selectedValues: string[] | undefined;
  let sliderValue: number | undefined;
  let dimensionValues: Record<string, number> | undefined;
  let ratingValue: number | undefined;
  let npsValue: number | undefined;

  if (apiQuestion.answer) {
    if (apiQuestion.answer.value !== undefined) {
      if (typeof apiQuestion.answer.value === 'string') {
        selectedValue = apiQuestion.answer.value;
      } else if (typeof apiQuestion.answer.value === 'number') {
        if (displayType === 'RATING') {
          ratingValue = apiQuestion.answer.value;
        } else if (displayType === 'Slider') {
          sliderValue = apiQuestion.answer.value;
        } else if (displayType === 'NPS') {
          npsValue = apiQuestion.answer.value;
        }
      }
    }
    
    if (apiQuestion.answer.values) {
      if (Array.isArray(apiQuestion.answer.values)) {
        selectedValues = apiQuestion.answer.values;
      } else if (typeof apiQuestion.answer.values === 'object') {
        dimensionValues = apiQuestion.answer.values as Record<string, number>;
      }
    }
  }

  // Since options are not provided in the API response, we create minimal options
  // based on the answer values for display purposes
  let options: any = {};
  
  if (displayType === 'RATING') {
    const maxStars = ratingValue && ratingValue > 0 ? Math.max(ratingValue, 5) : 5;
    options = {
      maxStars,
      labels: Array.from({ length: maxStars }, (_, i) => `Option ${i + 1}`)
    };
  } else if (displayType === 'single-choice' || displayType === 'Multi-select') {
    const answerValues = selectedValues || (selectedValue ? [selectedValue] : []);
    options = {
      type: displayType === 'single-choice' ? 'single-choice' : 'multiple-choice',
      choices: answerValues.map((val: string) => ({
        label: formatAnswerValue(val),
        value: val
      }))
    };
  } else if (displayType === 'Multi-Slider') {
    if (dimensionValues) {
      options = {
        dimensions: Object.keys(dimensionValues).map((key) => ({
          code: key,
          label: formatAnswerValue(key.replace('dimension', 'Dimension ')),
          min_value: 0,
          max_value: 100
        }))
      };
    }
  } else if (displayType === 'Slider') {
    options = {
      min: 0,
      max: sliderValue && sliderValue > 0 ? Math.max(sliderValue, 100) : 100,
      step: 1
    };
  }

  return {
    id: order,
    order: order,
    question: apiQuestion.text,
    type: displayType,
    weight: 0,
    status: 'Active',
    options,
    selectedValue,
    selectedValues,
    sliderValue,
    dimensionValues,
    ratingValue,
    npsValue,
  };
};

const renderQuestionComponent = (question: QuestionResponse) => {
  switch (question.type) {
    case "single-choice": {
      const options = formatChoiceOptions(question.options?.choices);
      // If no options but we have a selected value, create a simple display
      if (options.length === 0 && question.selectedValue) {
        return (
          <div className="space-y-2">
            <p className="text-[#46B753] font-golos text-xl font-semibold">
              {question.order}. {question.question}
            </p>
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm font-medium text-gray-900">
                {formatAnswerValue(question.selectedValue)}
              </p>
            </div>
          </div>
        );
      }
      return (
        <SingleChoiceQuestion
          question={question.question}
          questionNumber={question.order}
          value={question.selectedValue}
          options={options}
        />
      );
    }
    case "Multi-select":
    case "Checkbox": {
      const options = formatChoiceOptions(question.options?.choices);
      // If no options but we have selected values, create a simple display
      if (options.length === 0 && question.selectedValues && question.selectedValues.length > 0) {
        return (
          <div className="space-y-2">
            <p className="text-[#46B753] font-golos text-xl font-semibold">
              {question.order}. {question.question}
            </p>
            <div className="mt-3 space-y-2">
              {question.selectedValues.map((val, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{formatAnswerValue(val)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <MultipleChoiceQuestion
          question={question.question}
          questionNumber={question.order}
          value={question.selectedValues || []}
          options={options}
        />
      );
    }
    case "Slider": {
      const min = question.options?.min ?? 0;
      const value = question.sliderValue ?? min;
      return (
        <SliderQuestion
          question={question.question}
          questionNumber={question.order}
          min={question.options?.min}
          max={question.options?.max}
          step={question.options?.step}
          value={value}
          onChange={noop}
        />
      );
    }
    case "Multi-Slider":
      return (
        <div className="space-y-4">
          <p className="text-[#46B753] font-golos text-xl font-semibold">{question.question}</p>
          <div className="space-y-4">
            {question.dimensionValues && Object.keys(question.dimensionValues).length > 0 ? (
              Object.entries(question.dimensionValues).map(([key, value], idx) => {
                const dimension = question.options?.dimensions?.find((d: { code: string; label?: string }) => d.code === key);
                return (
                  <SliderQuestion
                    key={key}
                    question={dimension?.label || `Dimension ${idx + 1}`}
                    questionNumber={undefined}
                    min={0}
                    max={100}
                    step={1}
                    value={value as number}
                    onChange={noop}
                  />
                );
              })
            ) : (
              <div className="text-sm text-gray-500">No dimension values available</div>
            )}
          </div>
        </div>
      );
    case "RATING":
      return (
        <StarRatingQuestion
          question={question.question}
          questionNumber={question.order}
          value={question.ratingValue ?? 0}
          maxStars={question.options?.maxStars ?? 5}
          labels={question.options?.labels}
        />
      );
    case "NPS": {
      const labels = question.options?.labels || [];
      const options = labels.map((label: string, index: number) => ({ value: index.toString(), label }));
      return (
        <VisualRatingQuestion
          question={question.question}
          questionNumber={question.order}
          options={options}
          value={question.npsValue !== undefined ? question.npsValue.toString() : undefined}
        />
      );
    }
    case "Smiley face": {
      const options = (question.options?.options || []).map((option: any) => ({
        value: option.value.toString(),
        label: option.label,
      }));
      return (
        <VisualRatingQuestion
          question={question.question}
          questionNumber={question.order}
          options={options}
          value={question.selectedValue}
        />
      );
    }
    default:
      return (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Answer data not available for this question type.
        </div>
      );
  }
};

const BankingSPOResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { spoId } = useParams<{ spoId: string }>();
  const numericId = spoId ? Number(spoId) : NaN;
  
  const { selected, isDetailLoading } = useAppSelector((state) => state.bankingSpo);
  const {
    assessmentResponses,
    isAssessmentResponsesLoading,
    assessmentResponsesError,
  } = useAppSelector((state) => state.adminSpo);

  const activeSpo = selected && !Number.isNaN(numericId) && selected.id === numericId ? selected : null;
  const assessmentId = activeSpo?.assessment_id;

  // Fetch SPO details if not already loaded
  useEffect(() => {
    if (Number.isNaN(numericId)) return;
    if (!activeSpo) {
      void dispatch(fetchBankSpoById(numericId));
    }
  }, [dispatch, numericId, activeSpo]);

  // Fetch assessment responses when we have both spoId and assessmentId
  useEffect(() => {
    if (!assessmentId || Number.isNaN(numericId)) {
      return;
    }

    dispatch(fetchAssessmentResponses({ 
      spoId: numericId, 
      assessmentId: assessmentId 
    }));

    return () => {
      dispatch(resetAssessmentResponses());
    };
  }, [dispatch, numericId, assessmentId]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAssessmentResponsesError());
    };
  }, [dispatch]);

  // Convert API response to QuestionResponse format
  const questionResponses: QuestionResponse[] = React.useMemo(() => {
    if (!assessmentResponses?.sections) return [];
    
    let order = 1;
    const responses: QuestionResponse[] = [];
    
    for (const section of assessmentResponses.sections) {
      for (const question of section.questions) {
        responses.push(convertApiResponseToQuestionResponse(question, order));
        order++;
      }
    }
    
    return responses;
  }, [assessmentResponses]);

  if (Number.isNaN(numericId)) {
    return (
      <BankingLayoutWrapper>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          Invalid SPO identifier.
        </div>
      </BankingLayoutWrapper>
    );
  }

  // Show loading while fetching SPO details
  if (isDetailLoading || (!activeSpo && !Number.isNaN(numericId))) {
    return (
      <BankingLayoutWrapper>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <img src={BackIcon} alt="Back" className="w-8 h-8" />
            </button>
            <div>
              <h1
                className="text-gray-800"
                style={{
                  fontFamily: "Baskervville",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "32px",
                }}
              >
                Social Enterprises Assessment Responses
              </h1>
            </div>
          </div>
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading SPO details...</p>
            </div>
          </div>
        </div>
      </BankingLayoutWrapper>
    );
  }

  // Show error if assessment_id is missing (only after SPO is loaded)
  if (!Number.isNaN(numericId) && activeSpo && !assessmentId) {
    return (
      <BankingLayoutWrapper>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <img src={BackIcon} alt="Back" className="w-8 h-8" />
            </button>
            <div>
              <h1
                className="text-gray-800"
                style={{
                  fontFamily: "Baskervville",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "32px",
                }}
              >
                Social Enterprises Assessment Responses
              </h1>
            </div>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-sm text-yellow-800">
            No assessment found for this SPO. Assessment responses are only available for SPOs who have completed an assessment.
          </div>
        </div>
      </BankingLayoutWrapper>
    );
  }

  return (
    <BankingLayoutWrapper>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <img src={BackIcon} alt="Back" className="w-8 h-8" />
          </button>
          <div>
            <h1
              className="text-gray-800"
              style={{
                fontFamily: "Baskervville",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "32px",
              }}
            >
              Social Enterprises Assessment Responses
            </h1>
            <p className="text-sm text-gray-500">Showing recorded answers for SPO #{spoId ?? "—"}</p>
          </div>
        </div>

        {assessmentResponsesError && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{assessmentResponsesError}</span>
            <Button
              onClick={() => {
                dispatch(clearAssessmentResponsesError());
                if (!Number.isNaN(numericId) && assessmentId) {
                  dispatch(fetchAssessmentResponses({ 
                    spoId: numericId, 
                    assessmentId: assessmentId 
                  }));
                }
              }}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        )}

        {isAssessmentResponsesLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading assessment responses...</p>
            </div>
          </div>
        ) : questionResponses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            No assessment responses found.
          </div>
        ) : (
          <div className="space-y-5">
            {questionResponses.map((question) => (
              <Card key={question.id} className="shadow-sm border border-gray-100">
                <CardContent className="p-6">
                  <div className="pointer-events-none">{renderQuestionComponent(question)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BankingLayoutWrapper>
  );
};

export default BankingSPOResponsesPage;
