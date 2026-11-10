const Loader = () => {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center" role="status" aria-label="Loading">
      <span className="airbnb-puff-loader" aria-hidden="true">
        <span className="airbnb-puff-loader__ring airbnb-puff-loader__ring--delayed" />
        <span className="airbnb-puff-loader__ring" />
      </span>
      <span className="sr-only">Loading</span>
    </div>
  );
};
export default Loader;
