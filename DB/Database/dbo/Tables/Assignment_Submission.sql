-- Assignment_Submission table: Student submissions for assignments
CREATE TABLE [dbo].[Assignment_Submission]
(
    [Id] INT IDENTITY(1,1) NOT NULL,
    [AssignmentId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    [FlowData] NVARCHAR(MAX) NULL, -- JSON snapshot of student's flow
    [Score] INT NULL,
    [Status] NVARCHAR(20) NOT NULL DEFAULT 'Not Started', -- Not Started, In Progress, Submitted, Graded
    [SubmittedDate] DATETIME NULL,
    [GradedDate] DATETIME NULL,
    [TeacherFeedback] NVARCHAR(MAX) NULL,
    
    [AddDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME NULL,
    [ChangeSource] NVARCHAR(50) NULL,
    
    CONSTRAINT [PK_Assignment_Submission] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Submission_Assignment] FOREIGN KEY ([AssignmentId]) 
        REFERENCES [Assignment]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Submission_Student] FOREIGN KEY ([StudentId]) 
        REFERENCES [User]([Id]),
    CONSTRAINT [CHK_Submission_Status] CHECK ([Status] IN 
        ('Not Started', 'In Progress', 'Submitted', 'Graded')),
    CONSTRAINT [CHK_Submission_Score] CHECK ([Score] >= 0)
)
GO

CREATE INDEX [IX_Submission_Assignment] ON [Assignment_Submission]([AssignmentId])
GO

CREATE INDEX [IX_Submission_Student] ON [Assignment_Submission]([StudentId])
GO

CREATE INDEX [IX_Submission_Status] ON [Assignment_Submission]([Status])
GO

-- One submission per student per assignment
CREATE UNIQUE INDEX [UX_Submission_Student_Assignment] 
    ON [Assignment_Submission]([AssignmentId], [StudentId])
GO
