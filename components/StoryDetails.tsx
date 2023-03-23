interface Props {
    story: { title: string; description: string; id: string }
}

const StoryDetails = ({ story }: Props) => {
    return (
        <div>
            <p className='text-lg font-bold'>{story?.title}</p>
            <div>{story?.description}</div>
        </div>
    )
}

export default StoryDetails
