import Story from '@/models/story.model'
import { Tooltip } from 'react-tooltip'

interface Props {
    userStories: Story[]
    onStoryClick?: (id: string) => void
    selectedStoryId?: string
}

const UserStoriesTable = ({
    userStories,
    onStoryClick,
    selectedStoryId,
}: Props) => {
    userStories.sort((a, b) => {
        if (a.estimation) return 1
        if (b.estimation) return -1
        return 0
    })

    const rowClasses = (id: string) => {
        let res = ''
        if (selectedStoryId === id) {
            res += 'font-bold '
        }
        if (onStoryClick) {
            res += 'cursor-pointer hover:font-bold '
        }
        return res
    }

    return (
        <table className='border-separate border-spacing-x-4 border-spacing-y-2 table-fixed w-full'>
            <colgroup>
                <col className='w-[8%] min-w-[42px]' />
                <col />
                <col className='w-[11%] min-w-[100px]' />
            </colgroup>
            <thead>
                <tr className='uppercase text-xs'>
                    <th>id</th>
                    <th>title</th>
                    <th>estimation</th>
                </tr>
            </thead>
            <tbody>
                {userStories.map((story) => (
                    <tr
                        key={story.id}
                        onClick={
                            onStoryClick
                                ? () => onStoryClick(story.id)
                                : undefined
                        }
                        className={rowClasses(story.id)}
                    >
                        <td>{story.id}</td>
                        <td
                            className='overflow-hidden whitespace-nowrap text-ellipsis w-1'
                            data-tooltip-id={story.id}
                            data-tooltip-delay-show={200}
                        >
                            {story.title}
                            <Tooltip id={story.id}>
                                <div className='max-w-xs h-auto break-normal text-wrap'>
                                    {story.title}
                                </div>
                            </Tooltip>
                        </td>
                        <td className='text-sm text-primary ml-2'>
                            {story.estimation
                                ? `${story.estimation} points`
                                : 'Non estimée'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default UserStoriesTable
