import { FiPlus } from "react-icons/fi";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "../ui/animated-modal";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { BottomGradient, LabelInputContainer } from "../signin-form";
import { Input } from "../ui/input";
import { ChangeEvent, FormEvent, useState } from "react";
import {v4 as uuid} from 'uuid'
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useBoardContext } from "@/contexts/BoardContext";
import { useRouter } from "next/navigation";
import {ClipLoader} from 'react-spinners'

function CreateBoardCard() {

    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const {userId, status} = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!userId){
            return;
        }
        console.log(title);
        setLoading(true);
        
        try{
            const res = await fetch('/api/board', {
                method: "POST",
                body: JSON.stringify({
                    title,
                    userId,
                    shapes: [],
                    position: {
                        x: 0,
                        y: 0
                    },
                    scale: 1
                })
            })
    
            const data = await res.json();  
            console.log(data);
    
    
            if(res.ok){
                toast.success("Board Created");
                router.push(`/boards/${data.board.id}`)
            }
        }catch(error){
            console.log("Something went wrong", error);
            toast.error("Try again later");
            setLoading(false)
        }
        

      }


    return (
        <Modal>
            <ModalTrigger>
                <Card className="flex flex-col items-center justify-center border border-dashed hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer h-[220px]">
                    <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <FiPlus size={24} className="text-primary" />
                        </div>
                        <p className="font-medium text-center">Create New Board</p>
                    </CardContent>
                </Card>

            </ModalTrigger>

            <ModalBody
            className="min-h-[unset]"
            >
                <ModalContent
                className="justify-center"
                >
                    <div
                    className="h-full"
                    >

                        {loading && <div className="absolute inset-0 bg-muted-foreground/50 flex items-center justify-center">
                            <ClipLoader size={30}/>

                        </div>}
                              <form className="my-auto h-full" onSubmit={handleSubmit} >
                                
                                <LabelInputContainer className="mb-4">
                                  <Label className="text-lg sm:text-xl" htmlFor="title">Title</Label>
                                  <Input id="text" className="text-lg sm:text-xl placeholder:text-lg sm:placeholder:text-xl"  placeholder="Board Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </LabelInputContainer>
                    
                          
                        
                                <button
                                disabled={loading}
                                  className="bg-gradient-to-br relative group/btn from-primary  dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                  type="submit"
                                >
                                    Create Board
                                  <BottomGradient />
                                </button>
                        
                           
                     
                              </form>
                    </div>
                 
                </ModalContent>
            </ModalBody>

        </Modal>
    )
}

export default CreateBoardCard;