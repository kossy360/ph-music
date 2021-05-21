import qs from 'qs';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography } from './Typography';

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: start;
  gap: 1rem;

  .userAvatar {
    display: flex;
    align-items: center;

    img {
      height: 2.5rem;
      border-radius: 50%;
    }
  }
`;

const UserAvatar = () => {
  const userData = useSelector((state) => state.user.userData);
  const imageUrl = userData?.images[0]?.url;

  return (
    <Container>
      <div className="userAvatar">
        <img
          src={
            imageUrl
              ? imageUrl
              : `https://ui-avatars.com/api?${qs.stringify({
                  name: userData?.display_name,
                })}`
          }
          alt="user avatar"
        />
      </div>
      <Typography textStyle="sm16" textTransform="capitalize">
        {userData?.display_name ?? ''}
      </Typography>
    </Container>
  );
};

export default UserAvatar;
