import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Colors } from './utils/_var';

const Bnt = styled.button`
  border: 1px solid ${Colors.mediumGray};
  height: fit-content;
  margin-top: 1.5rem;
  padding: 0.5rem 0.75rem;
`;

function MainBnt() {
  const navigate = useNavigate();

  return (
    <Bnt
      onClick={() => {
        navigate('/');
      }}
    >
      메인으로 이동
    </Bnt>
  );
}

export default MainBnt;
