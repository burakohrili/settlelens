import { UpgradeClient } from "./UpgradeClient";

export default function UpgradePage() {
  const priceIds = {
    clarified: process.env.PADDLE_CLARIFIED_PRICE_ID ?? "",
    strategist: process.env.PADDLE_STRATEGIST_PRICE_ID ?? "",
    professional: process.env.PADDLE_PROFESSIONAL_PRICE_ID ?? "",
  };

  return (
    <UpgradeClient
      priceIds={priceIds}
      paddleToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ""}
      paddleEnv={process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "production"}
    />
  );
}
