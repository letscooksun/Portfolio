import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import './App.css';

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main" tabIndex={-1}></main>
      </MotionConfig>
    </LazyMotion>
  );
}
