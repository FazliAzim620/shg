import React from "react";
import Credentialing from "../../provider_portal/provider_pages/credentials/Credentialing";
import { useLocation } from "react-router-dom";

const CredentialingProviderDetails = () => {
  const location = useLocation();
  return <Credentialing userId={location?.state?.currentUser?.user?.id} />;
};

export default CredentialingProviderDetails;
