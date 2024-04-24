interface Props {
    story: {
        title: string
        description: string
        id: string
        estimation: string
    }
}

const StoryDetails = ({ story }: Props) => {
    if (!story) return null
    return (
        <div>
            <p className='text-lg font-bold'>
                {story.id} - {story.title}
            </p>
            {story.estimation && <p>{story.estimation}</p>}
            {!story.estimation && <p>Non estimée</p>}
            <div dangerouslySetInnerHTML={{ __html: story.description }}></div>
        </div>
    )
}

export default StoryDetails
