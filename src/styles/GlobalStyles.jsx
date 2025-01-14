import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    :root {
        --red-color: #FF3951;
        --darkgrey-color: #2F323D;
        --midgrey-color: #3A3C43;
        --lightgrey-color: #CED2E0;
    }

    body {
        margin: 0;
        /* font-family: Pretendard, Pretendard-Bold, Pretendard-ExtraBold, Pretendard-Light, Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin, sans-serif; */
        /* background-color: #151515; */
    }
`

export default GlobalStyle
