
export async function getPhotos (page) {
        return await (await fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`)).json()
    }
