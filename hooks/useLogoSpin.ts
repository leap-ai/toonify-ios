import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export interface AnimationController {
  start: () => void;
  stop: () => void;
  isAnimating: boolean;
  spinValue: Animated.Value;
}

/**
 * Hook to create a controlled spinning animation
 * @param duration Animation duration in milliseconds
 * @param autoStart Whether to start the animation automatically
 * @returns Animation controller with start/stop functions
 */
export const useLogoSpinAnimation = (
  duration: number = 8000,
  autoStart: boolean = true
): AnimationController => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const isAnimatingRef = useRef(false);

  // Create the animation
  const createAnimation = () => {
    return Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );
  };

  // Start the animation
  const start = () => {
    if (isAnimatingRef.current) return;
    
    // Create a new animation instance if needed
    if (!animationRef.current) {
      animationRef.current = createAnimation();
    }
    
    // Make sure we're starting from 0 degrees
    spinValue.setValue(0);
    
    animationRef.current.start();
    isAnimatingRef.current = true;
  };

  // Stop the animation
  const stop = () => {
    if (!isAnimatingRef.current || !animationRef.current) return;
    
    animationRef.current.stop();
    
    // Reset the spin value to 0 to return to the default position
    Animated.timing(spinValue, {
      toValue: 0,
      duration: 300, // Short duration for reset animation
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
    
    isAnimatingRef.current = false;
  };

  // Auto-start on mount if enabled
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      spinValue.setValue(0);
    };
  }, []);

  return {
    start,
    stop,
    isAnimating: isAnimatingRef.current,
    spinValue
  };
};

/**
 * Creates an interpolated spin animation for the Y axis
 * @param spinValue The animated value to interpolate
 * @returns Interpolated rotation string for use in transform
 */
export const getSpinInterpolation = (spinValue: Animated.Value): Animated.AnimatedInterpolation<string> => {
  return spinValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '180deg', '0deg', '-180deg', '0deg'],
  });
}; 