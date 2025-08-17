function TokenIntegrationRequest({ address }) {
  return (
    <div className="text-xs text-gray-500 pt-2">
      Using this token frequently?{" "}
      <a
        href="https://stability.nexus/"
        target="blank"
        className="text-blue-500 hover:underline"
      >
        Request adding to default list
      </a>
    </div>
  );
}

export default TokenIntegrationRequest;
