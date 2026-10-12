const courses = async () => {
    const response = await fetch("http://localhost:3001/api/courses");
    const data = await response.json();
    return data.data.courses;
}

// Ways to call the function
/*
courses().then(courses => {
    console.log(courses);
});
*/
(async () => {
    const data = await courses();
    console.log(data);
})();