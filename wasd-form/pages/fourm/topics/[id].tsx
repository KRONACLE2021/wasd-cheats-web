import React from 'react';
import { useRouter } from 'next/router';

const TopicPage : React.FC<any> = () => {

    const router = useRouter();

    const { query: { id } } = router;

    return (
        <div>
            {id}
        </div>
    );
}

export default TopicPage;