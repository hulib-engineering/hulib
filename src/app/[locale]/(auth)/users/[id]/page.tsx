import UserProfileClient from './_components/UserProfileClient';

type Props = {
  params: { id: string };
};

export default function UserProfilePage({ params }: Props) {
  return <UserProfileClient userId={params.id} />;
}
