import { ImageVariantFrontend } from "./types";

const APP_DISCLAIMER = "Note: Toonify is powered by AI and processes user-uploaded images to generate cartoonified results. While we do not moderate uploaded content, you are responsible for ensuring your uploads are respectful and safe for all audiences. Offensive, explicit, or inappropriate content may lead to unpredictable results."


const PLAN_NAMES: { [key: string]: string } = {
    'toonify_pro_monthly': 'Pro Monthly',
    'toonify_pro_yearly': 'Pro Yearly',
    'toonify_pro_weekly': 'Pro Weekly',
  };

const POSTHOG_SESSION_REPLAY_CONFIG: any = {
  // Whether text and text input fields are masked. Default is true.
  // Password inputs are always masked regardless
  maskAllTextInputs: true,
  // Whether images are masked. Default is true.
  maskAllImages: true,
  // Enable masking of all sandboxed system views like UIImagePickerController, PHPickerViewController and CNContactPickerViewController. Default is true.
  // iOS only
  maskAllSandboxedViews: true,
  // Capture logs automatically. Default is true.
  // Android only (Native Logcat only)
  captureLog: true,
  // Whether network requests are captured in recordings. Default is true
  // Only metric-like data like speed, size, and response code are captured.
  // No data is captured from the request or response body.
  // iOS only
  captureNetworkTelemetry: true,
  // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
  // Ps: it was 500ms (0.5s) by default until version 3.3.7
  androidDebouncerDelayMs: 1000,
  // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
  iOSdebouncerDelayMs: 1000,
};

export const VARIANT_OPTIONS: { 
  label: string; 
  value: ImageVariantFrontend; 
  image: any; 
  isPro: boolean;
}[] = [
  { label: 'Ghibli', value: 'ghiblix', image: require('@/assets/images/ghiblix.png'), isPro: false },
  { label: 'Sticker', value: 'sticker', image: require('@/assets/images/sticker.png'), isPro: false },
  { label: 'Pixar', value: 'pixar', image: require('@/assets/images/pixar.png'), isPro: true },
  { label: 'Plushy', value: 'plushy', image: require('@/assets/images/plushy.png'), isPro: true },
  { label: 'Kawaii', value: 'kawaii', image: require('@/assets/images/kawaii.png'), isPro: true },
  { label: 'Anime', value: 'anime', image: require('@/assets/images/anime.png'), isPro: true },
];

// Define best practices data structure
const BEST_PRACTICES: Record<ImageVariantFrontend, string[]> = {
  pixar: [
    "Clear, well-lit portrait or upper body shots work best.",
    "Avoid very busy backgrounds for optimal focus on the subject.",
    "1-2 people maximum for best character detail.",
    "Try choosing pictures without glasses since Pixar style focusses on the eyes."
  ],
  ghiblix: [
    "Scenic shots or expressive character faces are great.",
    "Softer lighting enhances the Ghibli feel.",
    "Ensure good contrast in the image."
  ],
  sticker: [
    "Clear subject, preferably a face or a distinct object.",
    "Simpler backgrounds help the sticker 'pop'.",
    "Good for solo subjects."
  ],
  plushy: [
    "Works well with animals, characters, or even people.",
    "Good lighting helps define the 'plush' texture.",
    "Avoid overly complex details that might get lost."
  ],
  kawaii: [
    "Use simple, front-facing portraits for best results.",
    "Avoid detailed or noisy backgrounds — plain is ideal.",
    "Soft lighting works better than dramatic shadows.",
    "Close-up shots of faces or cute objects yield more accurate 'kawaii' styling.",
    "Avoid sunglasses or harsh expressions — neutral or smiling faces are best."
  ],
  anime: [
    "High-resolution face or upper-body shots work best.",
    "Well-lit images with clear facial features improve stylization.",
    "Neutral or light expressions adapt best into anime character emotions.",
    "Avoid group shots — stick to 1-2 persons per image.",
    "Avoid heavy makeup or filters that may confuse the AI model."
  ]
};

const ANALYTICS_EVENTS = {
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  USER_CHANGED_PASSWORD: 'user_changed_password',
  SUBSCRIPTION_PURCHASED: 'subscription_purchased',
  CARTOON_GENERATED: 'cartoon_generated',
  // USER_DOWNLOADED_CARTOON: 'user_downloaded_cartoon',
  // USER_SHARED_CARTOON: 'user_shared_cartoon',
  // USER_USED_CREDITS: 'user_used_credits',
  // USER_RESTORED_CREDITS: 'user_restored_credits',
  // USER_USED_PROMO_CODE: 'user_used_promo_code',
  
}

export { APP_DISCLAIMER, PLAN_NAMES, POSTHOG_SESSION_REPLAY_CONFIG, BEST_PRACTICES, ANALYTICS_EVENTS };