import React, { useState } from "react";
import SliderQuestion from "../ui/question/SliderQuestion";
import Navbar from "../ui/Navbar";

const Assessment: React.FC = () => {
    const [affordability, setAffordability] = useState(15);

  return (
    <div className="max-w-2xl mx-auto p-6">
        <Navbar />
      <SliderQuestion
        question="2. What is the impact on the affordability of products / services for the target group?"
        value={affordability}
        onChange={setAffordability}
      />
    </div>
  );
};

export default Assessment;
