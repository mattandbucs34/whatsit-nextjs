'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { commentSchema, CommentInput } from '@/lib/validations/comment';
import { createCommentAction } from '@/app/comments/action';
import { IComment } from '@/interfaces/IComment';

interface CommentFormProps {
    postId: number;
    onCommentAdded: (comment: IComment) => void;
}

export const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CommentInput>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: '',
        },
    });

    const onSubmit = async (data: CommentInput) => {
        try {
            const newComment = await createCommentAction(postId, data.body);
            onCommentAdded(newComment);
            reset();
        } catch (err) {
            console.error('Failed to create comment:', err);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <Stack component={'form'} onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} spacing={2} sx={{ mt: 2 }}>
            <Typography variant={'h6'} sx={{ fontWeight: 600 }}>
                Leave a Comment
            </Typography>

            <Controller
                name={'body'}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={'Write a comment...'}
                        variant={'outlined'}
                        multiline={true}
                        rows={3}
                        fullWidth={true}
                        error={!!errors.body}
                        helperText={errors.body ? errors.body.message : 'Press Ctrl+Enter to submit'}
                        sx={{
                            background: 'rgba(22, 27, 34, 0.4)',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'divider',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(88, 166, 255, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                )}
            />

            <Stack direction={'row'} justifyContent={'flex-end'}>
                <Button
                    type={'submit'}
                    variant={'contained'}
                    color={'primary'}
                    disabled={isSubmitting}
                    sx={{ px: 4 }}
                >
                    Submit
                </Button>
            </Stack>
        </Stack>
    );
};
