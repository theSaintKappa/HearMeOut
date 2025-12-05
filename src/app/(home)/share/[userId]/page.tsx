export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    return <div>User Share Page - User ID: {userId}</div>;
}
