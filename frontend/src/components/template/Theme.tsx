import ConfigProvider from '@/components/ui/ConfigProvider';
import { themeConfig } from '@/configs/theme.config';
import useDarkMode from '@/utils/hooks/useDarkMode';
import useLocale from '@/utils/hooks/useLocale';

import type { CommonProps } from '@/@types/common';
import { ThemeProvider } from '@/theme/theme-provider';

import { ConfigProvider as AntdConfigProvider, ConfigProviderProps } from 'antd';
import antdLocale from 'antd/es/locale/pt_BR';
import { useState } from 'react';

type SizeType = ConfigProviderProps['componentSize'];

const Theme = (props: CommonProps) => {
    useDarkMode();
    const { locale } = useLocale();

    const [componentSize, setComponentSize] = useState<SizeType>('middle');

    const getAntdLocale = () => {
        console.log({ locale });
        switch (locale) {
            case 'pt':
                return require('antd/es/locale/pt_BR').default;
            case 'en':
            default:
                return antdLocale;
        }
    };

    return (
        <ThemeProvider>
            <AntdConfigProvider
                locale={getAntdLocale()}
                componentSize={componentSize}
                theme={{
                    token: {
                        colorPrimary: '#2a85ff'
                    },
                    components: {
                        Button: {
                            colorPrimary: '#2a85ff'
                        },
                    },
                }}
            >
                <ConfigProvider
                    value={{
                        locale: locale,
                        ...themeConfig,
                    }}
                >
                    {props.children}
                </ConfigProvider>
            </AntdConfigProvider>
        </ThemeProvider>
    );
};

export default Theme;
