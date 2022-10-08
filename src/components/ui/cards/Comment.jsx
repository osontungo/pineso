import Link from "next/link"
import { HiCheckCircle } from "react-icons/hi"
import UserImage from "@components/ui/UserImage"
import { CommentMeta } from "@components/ui/cards"


const CommentCard = ({ isSub, comment, profile}) => {
    const comments = comment.Comments
    return (
        <div className={`flex my-4 flex-col ${isSub ? `sub-comment` : ''}`}>
            <div className='flex flex-row'>
                <div className='image bg-gray-300 shadow rounded-full w-[40px] h-[40px]'>
                    <UserImage classes='w-[40px] shadow h-[40px]' publickey={profile.PublicKeyBase58Check} />
                </div>
                <div className='flex flex-col ml-2 items-start flex-1'>
                    <div className='flex flex-row items-center justify-center'>
                        <Link href={`/${profile.Username}`}>
                            <a className='inline-block'>
                                <div className='flex flex-row justify-center items-center'>
                                    <span className="mr-1 text-black font-semibold">{profile.Username}</span>
                                    {profile.IsVerified && <span><HiCheckCircle className="text-[#ec05ad]" size={16} /></span>}
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className='block'>
                        <span className='text-black break-all whitespace-pre-wrap'>{comment.Body}</span>
                    </div>
                    <CommentMeta post={comment} />
                </div>
            </div>
            {comments?.map((reply, index) => {
                const profile = reply.ProfileEntryResponse;
                return (
                    <CommentCard isSub={true} key={index} comment={reply} profile={profile} />
                )
            })}
        </div>
    )
}

export default CommentCard