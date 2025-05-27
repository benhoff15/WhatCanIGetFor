import i18n from '../lib/i18n';

export const useTranslation = () => {
  return {
    t: (scope: string, options?: any) => i18n.t(scope, options),
  };
};