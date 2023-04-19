interface Props {
  story: {
    title: string;
    description: string;
    id: string;
    estimation: string;
  };
}

const StoryDetails = ({ story }: Props) => {
  return (
    <div>
      <p className="text-lg font-bold">{story?.title}</p>
      {story?.estimation && <p>{story.estimation}</p>}
      {!story?.estimation && <p>Non estimée</p>}
      <div innerHTML={story?.description}></div>
    </div>
  );
};

export default StoryDetails;
