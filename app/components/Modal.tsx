import { XMarkIcon } from "@heroicons/react/24/solid";
import { Modal as BaseModal, Button } from "@mui/base";
import type { ModalProps  } from "@mui/base";
import React from "react";
import H2 from "./UI/Typography/H2";

type _ModalProps = ModalProps & {title: string}

const Modal = React.forwardRef((props: _ModalProps, ref: React.ForwardedRef<HTMLElement>) => {
  return (
    <BaseModal 
      className="
        flex justify-center items-center 
        rounded-lg 
        fixed 
        z-50 
        inset-0
        dark:text-white"
      slots={{
        backdrop: 'div'
      }}
      slotProps={{
        backdrop: {
          className: "-z-1 fixed inset-0 bg-black bg-opacity-50"
        }
      }}
      open={props.open} 
      onClose={props.onClose}>
        <div className="z-0 bg-white dark:bg-slate-800 rounded-lg relative p-6">
          <Button
            className="absolute top-2 right-2" 
            onClick={(e) => props.onClose(e, 'escapeKeyDown')}>
            <XMarkIcon className="w-6"/>
          </Button>
          <H2 className="mb-4">{props.title}</H2>
          {props.children}
        </div>
      </BaseModal>)
})

Modal.displayName = 'Modal'

export default Modal