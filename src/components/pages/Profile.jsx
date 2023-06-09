import UserImage from '@app/components/ui/UserImage';
import { nFormatter, toastOptions, withCSR } from '@app/lib/utils';
import useApp from '@app/stores/store';
import { useRouter } from 'next/router';
import { ErrorLoader, Loader, LoadingLoader } from '@components/loader';
import { BsPatchCheckFill } from 'react-icons/bs';
import Linkify from 'linkify-react';
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import { LinkifyOptions } from "@app/lib/utils";
import { getFollowings, getFollows, getIsFollowing, FetchExchangeRate, FetchSingleProfilebyUsername, getSingleProfilebyUsername, getUserFeed } from '@app/data';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { BASE_URL, EXTERNAL_LINK } from '@app/lib/constants';
import { IoDiamondOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import Grid from '@components/ui/Grid';
import Follow from '@components/ui/Follow';


const ProfilePage = (props) => {
    const router = useRouter();
    if (!router) return null
    const username = router.query.profile;
    const [active, setActive] = useState({ feed: true, saved: false })
    const isLoggedIn = useApp((state) => state.isLoggedIn)
    const user = useApp((state) => state.user)

    const { data: profile, isLoading: profileLoading, isFetching, isFetched: profileFetched, error, isError } = useQuery([['single-profile', username], { username }], getSingleProfilebyUsername, { enabled: !!username, });
    const { data: exchange } = FetchExchangeRate();

    const profileID = profile?.PublicKeyBase58Check || null;
    const userID = user?.profile?.PublicKeyBase58Check || null;


    const { data: follows, isFetched: followIsFetched, isLoading: followIsLoading } = useQuery([['total-follows', profileID], { publicKey: profileID }], getFollows, { enabled: !!profileID, })

    const { data: followings, isFetched: followingsIsFetched, isLoading: followingsIsLoading } = useQuery([['total-followings', profileID], { publicKey: profileID }], getFollowings, { enabled: !!profileID, })

    const { data: userPosts, isLoading: userPostsIsLoading, isFetched: userPostsIsFetched } = useQuery([['user-feed', profileID], { publicKey: profileID }], getUserFeed, { enabled: !!profileID, })

    const exchangeRate = exchange?.USDCentsPerDeSoExchangeRate/100

    const userCoinPrice = (profile?.CoinPriceDeSoNanos / 1000000000) * exchangeRate;

    const feedTab = () => {
        setActive({ feed : true, saved : false})
    }

    const saveTab = () => {
        setActive({ feed : false, saved : true})
    }
    
    if (isError) {
        return ( <ErrorLoader error={error}/>  )
    }
    if (profileLoading || followIsLoading || followingsIsLoading) {
        return ( <LoadingLoader message={`Loading Profile`}/> )
    }
    if (profileFetched && followIsFetched && followingsIsFetched) {
        return (
            <>
                <Head>
                    <meta name="description" content={profile?.Description}/>
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`${BASE_URL}/${profile?.Username}`} />
                    <meta property="og:title" content={`${profile?.Username} on Pineso`} />
                    <meta property="og:description" content={profile?.Description}/>
                    <meta property="og:image" content={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`}/>
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content={`${BASE_URL}/${profile?.Username}`} />
                    <meta property="twitter:title" content={`${profile?.Username} on Pineso`} />
                    <meta property="twitter:description" content={profile?.Description}/>
                    <meta property="twitter:image" content={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`} />
                </Head>
                <div className='py-12 flex relative flex-col items-center justify-center'>
                    <BrowserView>
                        <div className='z-10 w-full flex flex-row items-start justify-start max-w-[600px]'>
                            {/* <UserImage classes={'shadow-lg min-w-40 max-h-40 border border-gray-200'} username={profile?.Username} profile={profile} /> */}
                            <img
                                className={`rounded-full shadow-lg min-w-40 max-h-40 border border-gray-200`}
                                alt={`${username}'s profile picture`}
                                src={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`}
                            />
                            <div className='flex flex-col ml-4 flex-auto'>
                                <div className='flex flex-row items-start'>
                                    <div className='flex-auto flex flex-row items-center'>
                                        <h1 className='text-3xl font-bold leading-none capitalize text-black'>{profile?.Username}</h1>
                                        {profile?.IsVerified && <span><BsPatchCheckFill className="ml-1 text-[#ec05ad]" size={22} /></span>}
                                    </div>
                                    <div className=''>
                                        <Follow user={user} profile={profile} />
                                    </div>
                                </div>
                                <div className='flex flex-row items-center'>
                                    {userCoinPrice && <span className='text-[#ec05ad] font-bold text-md mr-2'>≈${userCoinPrice.toFixed(2)} USD</span>}
                                </div>
                                <div className='mt-3'>
                                    <Linkify options={LinkifyOptions}>
                                        {profile?.Description ? profile.Description : ''}
                                    </Linkify>
                                </div>
                                <div className='flex flex-row items-start mt-3 justify-start'>
                                    <div>
                                        <a className='flex group flex-row items-center' href={`${EXTERNAL_LINK}/u/${profile.Username}`}  rel="noreferrer" target="_blank">
                                            <IoDiamondOutline className='text-blue-500 duration-75 delay-75 group-hover:text-[#ec05ad]' size={17} />
                                            <span className='text-blue-500 duration-75 delay-75 ml-1 group-hover:text-[#ec05ad] text-md font-semibold'>@{profile.Username}</span>
                                        </a>
                                    </div>
                                    <div className='ml-4'>{nFormatter(follows, 1)} Followers</div>
                                    <div className='ml-4'>{nFormatter(followings, 1)} Following</div>
                                </div>
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        <div className='z-10 w-full flex flex-col items-center -mt-12'>
                            <UserImage classes={'shadow-lg w-40 h-40 border border-gray-200'} username={profile?.Username} profile={profile} />
                            <div className='flex flex-col flex-auto'>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='flex flex-row w-full justify-center items-center'>
                                        <h1 className='text-3xl font-bold leading-none capitalize text-black'>{profile?.Username}</h1>
                                        {profile?.IsVerified && <span><BsPatchCheckFill className="ml-1 text-[#ec05ad]" size={22} /></span>}
                                    </div>
                                    <div className='flex flex-row items-center justify-center'>
                                        <Follow user={user} profile={profile} />
                                        {/* {(isLoggedIn && userID !== profileID) ?
                                        
                                            (isFollowing) ?
                                                <button onClick={() => onFollow()} className='bg-[#5634ee] hover:bg-[#ec05ad] text-white duration-75 delay-75 rounded-full px-4 py-1'>Following</button>
                                                :
                                                <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-[#ec05ad] duration-75 delay-75 text-white rounded-full px-4 py-1'>Follow</button>
                                            :
                                            (userID !== profileID) && <button onClick={() => onFollow()} className='hover:bg-[#5634ee] hover:text-white bg-[#ec05ad] duration-75 delay-75 text-white rounded-full px-4 py-1'>Follow</button>
                                        } */}
                                    </div>
                                </div>
                                <div className='flex flex-row justify-center items-center'>
                                    {userCoinPrice && <span className='text-[#ec05ad] font-bold text-md mr-2'>≈${userCoinPrice.toFixed(2)} USD</span>}
                                </div>
                                <div className='mt-3'>
                                    <Linkify options={LinkifyOptions}>
                                        {profile?.Description ? profile.Description : ''}
                                    </Linkify>
                                </div>
                                <div className='flex flex-row items-start mt-3 justify-start'>
                                    <div>
                                        <a className='flex group flex-row items-center' href={`${EXTERNAL_LINK}/u/${profile.Username}`} rel="noreferrer" target="_blank">
                                            <IoDiamondOutline className='text-blue-500 duration-75 delay-75 group-hover:text-[#ec05ad]' size={17} />
                                            <span className='text-blue-500 duration-75 delay-75 ml-1 group-hover:text-[#ec05ad] text-md font-semibold'>@{profile.Username}</span>
                                        </a>
                                    </div>
                                    <div className='ml-4'>{nFormatter(follows, 1)} Followers</div>
                                    <div className='ml-4'>{nFormatter(followings, 1)} Following</div>
                                </div>
                            </div>
                        </div>                        
                    </MobileView>
                    <div className='flex flex-col relative w-full mt-8'>
                        <div className='tabs flex flex-row items-center justify-center'>
                            <div className='tab mr-4'>
                                <h3 onClick={feedTab} className={`${active.feed ? `bg-[#5634ee] text-white` : ` text-black`} cursor-pointer text-[16px] font-medium duration-75 delay-75 hover:text-white px-3 py-1 rounded-full hover:bg-[#5634ee]`}>Created</h3>
                            </div>
                            <div className='tab'>
                                <h3 onClick={saveTab} className={`${active.saved ? `bg-[#5634ee] text-white` : ` text-black`} cursor-pointer text-[16px] font-medium duration-75 delay-75 hover:text-white px-3 py-1 rounded-full hover:bg-[#5634ee]`}>Saved</h3>
                            </div>
                        </div>
                        {active.feed && <div className='feedTab block relative mt-8'>
                            {/* {userPostsIsLoading && <Loader className={`h-7 w-7 text-[#ec05ad]`} />} */}
                            {/* {userPostsIsFetched && userPosts?.length === 0 && <div className='text-center text-[#ec05ad] font-bold text-xl'>No Pins</div>} */}
                       
                                {userPostsIsLoading ?
                                    <div className='flex flex-row items-center justify-center'><Loader className={`h-7 w-7 text-[#ec05ad]`} /></div> :
                                    userPosts.length > 0 ? <Grid posts={userPosts}/> : <div className='text-center text-[#ec05ad] font-bold text-xl'>No Pins</div>
                                }
                        </div>}
                        {active.saved && <div className='feedTab w-full mt-8'>
                            <div className='text-center text-[#ec05ad] font-bold text-xl'>No Pins</div>
                        </div>}
                    </div>
                </div>
            </>
        )
    }
}

export default ProfilePage

export const getServerSideProps = withCSR(async (ctx) => {
    let page = 1;
    if (ctx.query.page) {
        page = parseInt(ctx.query.page);
    }
    const username = ctx.query.profile;

    const queryClient = new QueryClient();

    let isError = false;
    console.log(ctx.query);
    try {
        await queryClient.prefetchQuery([['single-profile', username], { username }], getSingleProfilebyUsername, { enabled: !!username, });
    } catch (error) {
        isError = true
        ctx.res.statusCode = error.response.status;
    }
    return {
        props: {
            //also passing down isError state to show a custom error component.
            isError,
            dehydratedState: dehydrate(queryClient),
        },
    }
})