import { useForm } from 'react-hook-form'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from 'web-2025'

// Form = FormProvider của react-hook-form, FormField = Controller → BẮT BUỘC có useForm
// control, không có thì FormLabel/useFormField ném lỗi và card trắng.
export const ContactForm = () => {
  const form = useForm({
    defaultValues: { name: 'Lương Vĩ Phú', email: '', message: '' },
  })
  return (
    <Form {...form}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420, maxWidth: '100%' }}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input placeholder='Tên của bạn' {...field} />
              </FormControl>
              <FormDescription>Hiển thị công khai kèm phản hồi.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='you@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lời nhắn</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder='Mình muốn trao đổi về…' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='button'>Gửi lời nhắn</Button>
      </form>
    </Form>
  )
}
