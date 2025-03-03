import './Spinner.css';

interface SpinnerProps {

  className?: string; 

  size?: number;

}

// https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
export const Spinner = (props: SpinnerProps) => {

  const width = props.size || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100" 
      className={props.className ? `${props.className} spinner` : 'spinner'}
      style={{ width }}>
      <circle cx="50" cy="50" r="45" />
    </svg>
  )

}