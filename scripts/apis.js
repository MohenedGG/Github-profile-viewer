export async function getUser(UserName) {
    const data = await fetch(`https://api.github.com/users/${UserName}`)
    if(!data.ok) {
        throw new Error("User not found!");
    }
    return await data.json();
}
export async function getRepo(UserName) {
    const data = await fetch(`https://api.github.com/users/${UserName}/repos`);
    if (!data.ok) {
        throw new Error("User not found!");
    }
    return await data.json();
}