import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    :root {
        --main-color: #FF4747;
        --pink-color: #FFD1D1;
        --white-color: #FFFFFF;
        --black-color: #000000;
        --darkgrey-color: #767676;
        --midgrey-color: #AAAAAA;
        --lightgrey-color: #F6F7F9;
        --grey-color: #E6E6E6;
    }

    body {
        margin: 0;
        /* font-family: Pretendard, Pretendard-Bold, Pretendard-ExtraBold, Pretendard-Light, Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin, sans-serif; */
        background-color: #F6F7F9;
        
    }

    input {
        outline: none;
    }
`

export default GlobalStyle