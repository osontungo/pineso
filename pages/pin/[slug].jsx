import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { Layout } from '@app/components/layout';
import { LoadingLoader } from '@app/components/loader';

const PostPage = dynamic(() => import('@app/components/pages/Post'), {
  suspense: true,
})
// import { PostPage } from '@app/components/pages';

const Single = () => {
    return (
        <>
            <Layout>
                <Suspense fallback={<LoadingLoader/>}>
                    <PostPage />
                </Suspense>
            </Layout>
        </>
    )
}
export default Single
