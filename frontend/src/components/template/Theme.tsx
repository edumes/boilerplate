import ConfigProvider from '@/components/ui/ConfigProvider';
import { themeConfig } from '@/configs/theme.config';
import useDarkMode from '@/utils/hooks/useDarkMode';
import useLocale from '@/utils/hooks/useLocale';
import useDirection from '@/utils/hooks/useDirection';

import type { CommonProps } from '@/@types/common';
import { ThemeProvider } from '@/theme/theme-provider';

const Theme = (props: CommonProps) => {
    useDarkMode();
    useDirection();

    const { locale } = useLocale();

    return (
        <ThemeProvider>
            <ConfigProvider
                value={{
                    locale: locale,
                    ...themeConfig,
                }}
            >
                {props.children}
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default Theme;
