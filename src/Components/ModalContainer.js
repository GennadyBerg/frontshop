import { styled } from "@mui/material";

const ModalOverlay = styled('div')({
  position: "absolute",
  zIndex: 9,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Modal = styled('div')({
  backgroundColor: "#ffffff",
  border: "1px solid #bebebe",
  borderRadius: "2px",
  padding: "12px 16px",
  position: "relative",
});

const ModalClose = styled('div')({
  position: "absolute",
  right: "8px",
  top: "4px",
  fontSize: "24p",
  cursor: "pointer"
});

const ModalContainer = ({ children, onCloseClick }) => 
  <ModalOverlay>
    <Modal>
      <ModalClose onClick={onCloseClick}>
        &#10005; {}
      </ModalClose>
      {children}
    </Modal>
  </ModalOverlay>


export { ModalContainer };