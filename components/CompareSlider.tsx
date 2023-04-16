import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const CompareSlider = ({
  original,
  generated,
}: {
  original: string;
  generated: string;
}) => {
  return (
    <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={original} alt="original photo" />}
      itemTwo={<ReactCompareSliderImage src={generated} alt="generated photo" />}
      className="mt-5 rounded-lg shadow-lg"
    />
  );
};

export default CompareSlider;