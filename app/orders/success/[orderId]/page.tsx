import SuccessClient from "./SuccessClient";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <SuccessClient orderId={orderId} />;
}