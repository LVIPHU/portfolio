import { Button, Input, Label, Textarea } from '@/components/atoms'

export const ContactForm = () => {
  return (
    <form>
      <div className='grid gap-x-8 gap-y-5 md:grid-cols-2'>
        <div className='col-span-2 sm:col-span-1'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input placeholder='First name' id='firstName' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2 sm:col-span-1'>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input placeholder='Last name' id='lastName' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' placeholder='Email' id='email' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='tel'>Phone Number</Label>
          <Input type='tel' placeholder='Phone Number' id='tel' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='message'>Message</Label>
          <Textarea id='message' placeholder='Message' className='mt-1.5 bg-white shadow-none' rows={6} />
        </div>
      </div>
      <Button className='mt-6 w-full' size='lg'>
        Submit
      </Button>
    </form>
  )
}
