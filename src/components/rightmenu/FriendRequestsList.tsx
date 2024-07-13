"use client"
import { acceptFollowRequest, declineRequest } from "@/lib/actions"
import { FollowRequest, User } from "@prisma/client"
import Image from "next/image"
import { Fragment, useOptimistic, useState } from "react"


type RequestWithUser = FollowRequest & {
    sender: User
}
const FriendRequestsList = ({ requests }: { requests: RequestWithUser[] }) => {
    const [userRequests, setUserRequests] = useState(requests)
    const [optimisticRequests, setOptimisticRequests] = useOptimistic(userRequests, (state, value: number) => (state.filter((elem: RequestWithUser) => elem.id !== value)))

    const accept = async (senderId: string, requestId: number) => {
        setOptimisticRequests(requestId);
        try {
            await acceptFollowRequest(senderId);
            setUserRequests(prev => (prev.filter((elem: RequestWithUser) => elem.id !== requestId)))
        } catch (error) {
            console.log(error);

        }
    }
    const decline = async (senderId: string, requestId: number) => {
        setOptimisticRequests(requestId);
        try {
            await declineRequest(senderId);
            setUserRequests(prev => (prev.filter((elem: RequestWithUser) => elem.id !== requestId)))
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Fragment>
            {
                optimisticRequests.map((req: RequestWithUser) => (
                    <div key={req.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Image
                                src={
                                    req?.sender?.avatar ?? "/noAvatar.png"
                                }
                                className="w-10 h-10 rounded-full object-cover"
                                alt=""
                                width={40}
                                height={40}
                            />
                            <span className="font-semibold">{req?.sender?.username}</span>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <form action={() => accept(req.senderId, req.id)}>

                                <button  ><Image
                                    src={"/accept.png"}
                                    className="cursor-pointer"
                                    alt=""
                                    width={20}
                                    height={20}
                                />{" "}</button>

                            </form>
                            <form action={() => decline(req.senderId, req.id)}
                            >
                                <button>
                                    <Image
                                        src={"/reject.png"}
                                        className="cursor-pointer"
                                        alt=""
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            </form>
                        </div>
                    </div>))
            }
        </Fragment>
    )
}

export default FriendRequestsList
