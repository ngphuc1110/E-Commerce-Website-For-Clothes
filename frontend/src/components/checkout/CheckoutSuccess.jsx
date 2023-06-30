import React from "react";
import styled from "styled-components";

const CheckoutSuccess = () => {
  return (
    <Container>
      <Content>
        <Heading>Checkout Success</Heading>
        <Message>Your order has been successfully placed.</Message>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Content = styled.div`
  text-align: center;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

export default CheckoutSuccess;
