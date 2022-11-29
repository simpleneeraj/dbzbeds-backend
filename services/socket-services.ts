export const getActiveUserBySocketId = async (
    activeUsers: IActiveUser[],
    socketId: string
) => {
    return activeUsers.find((activeUser) => activeUser.socketId === socketId);
};

export const createActiveUser = async (
    activeUsers: IActiveUser[],
    activeUser: IActiveUser
) => {
    activeUsers.push(activeUser);
};

export const removeActiveUser = async (
    activeUsers: IActiveUser[],
    socketId: string
) => {
    const index = activeUsers.findIndex(
        (activeUser) => activeUser.socketId === socketId
    );
    if (index !== -1) {
        return activeUsers.splice(index, 1)[0];
    }
};

export const updateUserOrderIdBySocketId = async (
    activeUsers: IActiveUser[],
    socketId: string,
    orderId: string
) => {
    const activeUser = await getActiveUserBySocketId(activeUsers, socketId);
    if (activeUser) {
        activeUser.orderId = orderId;
    }
};

export const findActiveUserByOrderId = async (
    activeUsers: IActiveUser[],
    orderId: string
) => {
    return activeUsers.find((activeUser) => activeUser.orderId === orderId);
};

export const reomveOrderIdBySocketId = async (
    activeUsers: IActiveUser[],
    socketId: string
) => {
    const activeUser = await getActiveUserBySocketId(activeUsers, socketId);
    if (activeUser) {
        activeUser.orderId = undefined;
    }
};
