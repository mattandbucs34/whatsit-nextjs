'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { topicSchema, TopicInput } from '@/lib/validations/topic';
import { createTopicAction } from '../action';

const NewTopicPage = () => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<TopicInput>({
        resolver: zodResolver(topicSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const onSubmit = async (data: TopicInput) => {
        await createTopicAction(data);
    };

    return (
        <Container maxWidth={'sm'}>
            <Typography variant={'h4'} component={'h1'} mb={4}>
                New Topic
            </Typography>

            <Stack component={'form'} onSubmit={handleSubmit(onSubmit)} spacing={4}>
                <Controller
                    name={'title'}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={'Topic Title'}
                            variant={'outlined'}
                            fullWidth={true}
                            error={!!errors.title}
                            helperText={errors.title ? errors.title.message : 'Title must be 5 or more characters long'}
                        />
                    )}
                />

                <Controller
                    name={'description'}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={'Description'}
                            variant={'outlined'}
                            multiline={true}
                            rows={4}
                            fullWidth={true}
                            error={!!errors.description}
                            helperText={errors.description ? errors.description.message : 'Description must be 10 or more characters long'}
                        />
                    )}
                />

                <Button
                    type={'submit'}
                    variant={'contained'}
                    color={'primary'}
                    disabled={isSubmitting}
                >
                    Submit
                </Button>
            </Stack>
        </Container>
    );
};

export default NewTopicPage;