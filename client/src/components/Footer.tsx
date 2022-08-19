import styled from 'styled-components';
import { Colors } from '../components/utils/_var';

const FooterWrapper = styled.div`
  display: flex;
  width: 100vw;
  max-width: 100%;
  background-color: ${Colors.black};
  padding: 2.5rem 1rem 0.75rem;

  a,
  span {
    color: ${Colors.mediumGray};
  }
`;

const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
`;

const Copyright = styled.span`
  text-align: right;
  margin-right: 0;
  margin-left: auto;
`;

function Footer() {
  return (
    <FooterWrapper>
      <Link
        className='link'
        href='https://github.com/TTurbo0824/market-mockup'
        target='_blank'
        rel='noopener noreferrer'
      >
        Project Repository Link
      </Link>
      <Copyright className='copyright'>
        copyright &copy; {new Date().getFullYear()} Kyungjoo Ha All rights reserved.
      </Copyright>
    </FooterWrapper>
  );
}

export default Footer;
