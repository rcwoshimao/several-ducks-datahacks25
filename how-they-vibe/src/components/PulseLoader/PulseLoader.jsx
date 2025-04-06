import ContentLoader from "react-content-loader";

const PulseLoader = () => (
  <ContentLoader
    className="content-loader"
    viewBox="0 0 466 160"
    height={160}
    width={466}
    speed={1.5}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="39" cy="25" r="16" />
    <rect x="59" y="12" rx="5" ry="5" width="220" height="10" />
    <rect x="60" y="29" rx="5" ry="5" width="220" height="10" />
    
    <circle cx="440" cy="71" r="16" />
    <rect x="199" y="76" rx="5" ry="5" width="220" height="10" />
    <rect x="199" y="58" rx="5" ry="5" width="220" height="10" />

    <circle cx="41" cy="117" r="16" />
    <rect x="65" y="104" rx="5" ry="5" width="220" height="10" />
    <rect x="65" y="122" rx="5" ry="5" width="220" height="10" />
  </ContentLoader>
);

export default PulseLoader; 
