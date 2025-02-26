import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    :root {
        --main-color: #FF4747;
        --pink-color: #FFD1D1;
        --green-color: #65BF7F;
        --white-color: #FFFFFF;
        --black-color: #000000;
        --darkgrey-color: #767676;
        --midgrey-color: #AAAAAA;
        --lightgrey-color: #F6F7F9;
        --grey-color: #E6E6E6;
        --neutralgrey-color: #CDCDCD;
    }

    body {
        margin: 0;
        font-family: "Pretendard", sans-serif;
        background-color: #F6F7F9;
    }

    input {
        outline: none;
    }

    button, textarea {
        font-family: "Pretendard", sans-serif;
    }
`

export default GlobalStyle