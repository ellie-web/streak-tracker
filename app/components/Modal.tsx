import { XMarkIcon } from "@heroicons/react/24/solid";
import { Modal as BaseModal, Button } from "@mui/base";
import type { ModalProps  } from "@mui/base";
import React from "react";

type _ModalProps = ModalProps & {title: string}

const Modal = React.forwardRef((props: _ModalProps, ref: React.ForwardedRef<HTMLElement>) => {
  return (
    <BaseModal 
      className="flex justify-center items-center rounded-lg fixed z-50 inset-0"
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
        <div className="z-0 bg-white rounded-lg relative p-6">
          <Button
            className="absolute top-2 right-2" 
            onClick={(e) => props.onClose(e, 'escapeKeyDown')}>
            <XMarkIcon className="w-6"/>
          </Button>
          <h2 className="text-center text-2xl mb-4">{props.title}</h2>
          {props.children}
        </div>
      </BaseModal>)
})

Modal.displayName = 'Modal'

export default Modal