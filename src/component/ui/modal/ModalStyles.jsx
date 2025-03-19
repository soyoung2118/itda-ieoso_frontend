import styled from "styled-components";

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  export const ModalContent = styled.div`
    background-color: white;
    padding: 40px 80px;
    border-radius: 8px;
    text-align: center;
    width: 50%;
    max-width: 300px;
    font-size: 1rem;

    .button-container {
      display: flex;
      margin-top: 2rem;
      gap: 2rem;
      justify-content: center;
    }

    .close-button {
      background-color: #C3C3C3;
      color: var(--white-color);
      border: none;
      border-radius: 15px;
      padding: 10px 32px;
      font-size: 1rem;
      cursor: pointer;
      width: 125px;
    }

    .delete-button {
      background-color: var(--main-color);
      color: white;
      border: none;
      border-radius: 15px;
      padding: 15px 32px;
      font-size: 1rem;
      cursor: pointer;
      width: 125px;
    }
  `;

export const AlertModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 40px 80px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  max-width: 300px;
  font-size: 1rem;
  position: relative;

  .text {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .close-button {
  background: none;
  border: none;
  color: red;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  right: 30px;
  bottom: 20px;
  }
`;