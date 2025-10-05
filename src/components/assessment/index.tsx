import React, { useState } from "react";
import SliderQuestion from "../ui/question/SliderQuestion";
import Navbar from "../ui/Navbar";
import SingleChoiceQuestion from "../ui/question/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../ui/question/MultipleChoiceQuestion";
import VisualRatingQuestion from "../ui/question/VisualRatingQuestion";
import StarRatingQuestion from "../ui/question/StarRatingQuestion";

const Assessment: React.FC = () => {
    const [affordability, setAffordability] = useState(15);
    const [singleChoiceValue, setSingleChoiceValue] = useState<string>("");
    const [multipleChoiceValues, setMultipleChoiceValues] = useState<string[]>([]);
    const [visualRatingValue, setVisualRatingValue] = useState<string>("");
    const [starRatingValue, setStarRatingValue] = useState<number>(0);

    return (
        <>
            <Navbar />
            <div className="pt-20 p-6 grid gap-10">
                <VisualRatingQuestion
                    question="1. What is the return potential of the enterprise?"
                    value={visualRatingValue}
                    onChange={setVisualRatingValue}
                />

                <SliderQuestion
                    question="2. What is the impact on the affordability of products / services for the target group?"
                    value={affordability}
                    onChange={setAffordability}
                />

                <SingleChoiceQuestion
                    question="3. What is the impact on the affordability of products / services for the target group?"
                    value={singleChoiceValue}
                    onChange={setSingleChoiceValue}
                />

                <MultipleChoiceQuestion
                    question="4. Which of the following innovation types apply to your solution?"
                    value={multipleChoiceValues}
                    onChange={setMultipleChoiceValues}
                    options={[
                        { value: "product", label: "Product Innovation - New or significantly improved goods" },
                        { value: "service", label: "Service Innovation - New or significantly improved services" },
                        { value: "process", label: "Process Innovation - New or significantly improved production methods" },
                        { value: "business", label: "Business Model Innovation - New ways of creating and capturing value" },
                        { value: "social", label: "Social Innovation - New solutions to social problems" }
                    ]}
                />

                <StarRatingQuestion
                    question="5. What is the impact on the quality of products/services provided?"
                    value={starRatingValue}
                    onChange={setStarRatingValue}
                    maxStars={4}
                    labels={[
                        "Quality is inconsistent.",
                        "Quality is better",
                        "Quality meets standards",
                        "Quality exceeds expectations"
                    ]}
                />
            </div>
        </>
    );
};

export default Assessment;
