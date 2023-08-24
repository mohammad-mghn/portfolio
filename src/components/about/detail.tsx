type Props = {
  title: string;
  value: string;
};

function Detail({ title, value }: Props) {
  return (
    <div
      className="md:ml-4 mt-2"
      data-aos="zoom-out-right"
      data-aos-delay="100"
    >
      <h3 className="text-md lg:text-lg text-text font-bold">{title}:</h3>
      <h4 className="ml-4 mt-2 mb-3 text-sm lg:text-base text-darker-text font-bold">
        {value}
      </h4>
    </div>
  );
}

export default Detail;
