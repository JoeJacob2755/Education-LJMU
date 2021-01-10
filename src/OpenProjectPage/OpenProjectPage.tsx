import React from 'react';
import { SquareButton } from '../UI/buttons';

function OpenProjectPage() {
    return (
        <header className="h-screen-title bg-gray-900 flex flex-col items-center justify-center">
            <h1 className="text-9xl text-gray-300 p-20 select-none">DeepTrack 2</h1>
            <SquareButton className="w-72 mb-5">Create a new project!</SquareButton>
            <SquareButton className="w-72">Load an existing project</SquareButton>
        </header>
    );
}

export default OpenProjectPage;
