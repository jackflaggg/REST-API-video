export type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}

export type UserType = {
    id: number,
    userName: string
}

export type UserCourseBindingsType = {
    userId: number,
    courseId: number,
    date: Date
}
export const db: DBType = {
    courses: [
        {id: 1, title: 'front-en', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10}
    ],
    users: [
        {id: 1, userName: 'dimych'},
        {id: 2, userName: 'rasul'}
    ],
    userCourseBindings: [
        {userId: 1, courseId: 1, date: new Date(2022, 10, 1)},
        {userId: 1, courseId: 2, date: new Date(2022, 10, 1)},
        {userId: 2, courseId: 2, date: new Date(2022, 10, 1)}
    ]
};



export type DBType = {
    courses: CourseType[],
    users: UserType[],
    userCourseBindings: UserCourseBindingsType[]}